/**
 Resolves the user-configured Claude Code CLI executable, if any.
 * The Java daemon sets CLAUDE_CODE_PATH when the user has provided a custom
 path in Settings > Basic. When set, the Claude Agent SDK is told to spawn
 that binary instead of its bundled CLI via pathToClaudeCodeExecutable.
 * Returns null when unset/blank so callers can spread the field conditionally.
 */

/**
 Converts a WSL UNC path (e.g. \wsl.localhostUbuntuusrbinclaude or
 \wslUbuntuusrbinclaude) to its Linux form (/usr/bin/claude).
 Also handles forward-slash variants (//wsl.localhost/Ubuntu/...).
 Returns the input unchanged if it is not a WSL UNC path.
 */
export function convertWslUncToLinuxIfNeeded(path) {
  if (typeof path !== 'string') return path;
  const lower = path.toLowerCase();
  const isUncWsl =
    lower.startsWith('\\wsl.localhost\') ||
    lower.startsWith('\\wsl\') ||
    lower.startsWith('//wsl.localhost/') ||
    lower.startsWith('//wsl$/');
  if (!isUncWsl) return path;

  const normalized = path.replace(/\/g, '/');
  // normalized is now like //wsl.localhost/Ubuntu/usr/bin/claude
  const distroNameStart = normalized.indexOf('/', 2); // '/' before
  if (distroNameStart > 0) {
    const distroPathStart = normalized.indexOf('/', distroNameStart + 1); // '/' after
    if (distroPathStart > 0) {
      return normalized.substring(distroPathStart); // /usr/bin/claude
    }
  }
  return path;
}

export function getClaudeCliPathOverride() {
  const raw = process.env.CLAUDE_CODE_PATH;
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  return convertWslUncToLinuxIfNeeded(trimmed);
}
