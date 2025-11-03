# Claude Code Configuration

This directory contains configuration files for Claude Code.

## Directory Structure

- `commands/` - Custom slash commands for this project
- `settings.json` - Project-specific settings (optional)

## Custom Commands

Create custom slash commands by adding markdown files to the `commands/` directory.

Example: Create `commands/review.md`:

```markdown
Review the code for potential issues, including:
- Security vulnerabilities
- Performance problems
- Code style consistency
- Best practices
```

Then use it with `/review` in Claude Code.

## Settings

You can create a `settings.json` file to configure project-specific settings like hooks, custom instructions, and more.

For more information, visit: https://docs.claude.com/en/docs/claude-code
