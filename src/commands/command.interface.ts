export interface ICommand {
  name: string;

  handle(): void;
}
