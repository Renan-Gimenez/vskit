import { execa } from "execa";

/**
 * Executes a command for a specific IDE binary.
 * @param ideCommand The command/binary to run (e.g. 'code', 'cursor')
 * @param args Arguments to pass to the command
 * @returns The stdout of the command
 */
export async function executeIdeCommand(
  ideCommand: string,
  args: string[],
): Promise<string> {
  try {
    const { stdout } = await execa(ideCommand, args);
    return stdout;
  } catch (error: any) {
    throw new Error(
      `Failed to execute ${ideCommand} ${args.join(" ")}: ${error.message}`,
    );
  }
}
