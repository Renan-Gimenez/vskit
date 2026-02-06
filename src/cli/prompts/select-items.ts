import { checkbox } from "@inquirer/prompts";

export interface ItemSelection {
  items: ("extensions" | "settings")[];
}

export async function promptItemSelection(): Promise<ItemSelection> {
  const items = await checkbox<"extensions" | "settings">({
    message: "What would you like to migrate?",
    choices: [{ name: "Extensions", value: "extensions", checked: true }],
    validate: (answer) => {
      if (answer.length === 0) {
        return "You must choose at least one item.";
      }
      return true;
    },
    theme: {
      icon: {
        checked: "[x]",
        unchecked: "[ ]",
      },
    },
  });

  return { items };
}
