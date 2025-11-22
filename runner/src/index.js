const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();

// Accept JSON body with reasonable size limit
app.use(bodyParser.json({ limit: '1mb' }));

// POST /run { code, language }
app.post('/run', async (req, res) => {
  const { code, language } = req.body || {};
  if (!code) return res.status(400).json({ error: 'No code provided' });

  // Demo: only allow javascript for now
  if (language && language !== 'javascript') {
    return res.status(400).json({ error: 'Only javascript allowed in demo runner' });
  }

  // Create a unique temporary working directory for this run
  const id = uuidv4();
  const workDir = path.join('/tmp', 'runner', id);
  fs.mkdirSync(workDir, { recursive: true });

  // Write code to index.js inside the temp dir
  const filePath = path.join(workDir, 'index.js');
  fs.writeFileSync(filePath, code);

  // Docker run parameters
  const dockerImage = 'node:18-alpine';
  const timeoutMs = 5000; // overall timeout handle by spawn options or wrapper

  // Build docker command that mounts workDir read-only and runs node index.js
  const cmd = 'docker';
  const args = [
    'run', '--rm',
    '--network', 'none',             // disable networking inside container (important)
    '--memory=128m',                 // cap memory
    '--cpus=0.5',                    // cap CPU
    '-v', `${workDir}:/work:ro`,     // mount code read-only
    '-w', '/work',
    dockerImage,
    'node', 'index.js'
  ];

  try {
    // Spawn docker process to run the code
    const proc = spawn(cmd, args, { timeout: timeoutMs });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });

    proc.on('error', (err) => {
      console.error('docker run error', err);
    });

    proc.on('close', (code) => {
      // Clean up temp directory synchronously (best-effort)
      try { fs.rmSync(workDir, { recursive: true, force: true }); } catch (e) {}

      // Send combined result back
      res.json({ stdout, stderr, exitCode: code });
    });
  } catch (err) {
    console.error('run error', err);
    try { fs.rmSync(workDir, { recursive: true, force: true }); } catch (e) {}
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Runner listening on ${PORT}`));
