import { bold, blue, yellow, green, cyan } from "colorette";

export function showHelp() {
    console.log(`
${bold(blue('Classpro CLI'))} - Command Line Interface

${yellow('Commands:')}
  ${green('init')}           Initialize a new Classpro project
  ${green('upgrade')}        Update your backend and frontend to latest versions
  ${green('deploy')}         Build and start both frontend and backend
  ${green('config')}         Update project configuration
  ${green('help')}           Show this help message
  ${green('version')}        Get version of the CLI

${yellow('Usage:')}
  classpro <command>

${yellow('Example:')}
  ${cyan('classpro init')}
  ${cyan('classpro config urls')}
`);
}