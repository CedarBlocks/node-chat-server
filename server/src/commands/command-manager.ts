import { Client } from "../client/client";
import { ClientManager } from "../client/client-manager";
import { singleton } from "tsyringe";

const ws = /\s+/;

export interface CommandContext {
  args: string[];
  message: string;
  client: Client;
  clientManager: ClientManager
}

export interface CommandInformation {
  name: string;
  description: string;
}

export interface Command {
  name: string;
  description: string;
  handle(e: CommandContext): void | Promise<void>;
}

@singleton()
export class CommandManager {
  private _commands: { [name: string]: Command } = {};
  commands: { [name: string]: CommandInformation } = {}

  register(command: Command) {
    this._commands[command.name] = command;
    this.commands[command.name] = {
      name: command.name,
      description: command.description
    }
  }

  handle(clientManager: ClientManager, client: Client, input: string) {
    if (!input || input[0] !== "/") {
      return false;
    }

    const args = input.substr(1).split(ws);
    const name = args.shift();
    const command = this._commands[name];

    if (!command) {
      return true;
    }

    command.handle({
      args,
      clientManager,
      client,
      content: input
    })

    return true;
  }
}

export const commandManager = new CommandManager();