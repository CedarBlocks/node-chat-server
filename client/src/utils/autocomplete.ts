import { store } from "@/store";

export interface AutoComplete {
  text: string;
  textLowerCased: string;
  emoji?: string;
  image?: string;
  avatar?: string;
  value: string;
  description?: string;
}

export const emojisItems: AutoComplete[] = [];
const commandItems: AutoComplete[] = [];

commandItems.push({
  text: "avatar",
  textLowerCased: "avatar",
  value: `/avatar`,
  description: "Changes your avatar to a random avatar.",
});

commandItems.push({
  text: "nick",
  textLowerCased: "nick",
  value: `/nick`,
  description: "Changes your nickname.",
});

function add(name: string, list: AutoComplete[], source: AutoComplete[]) {
  for (let i = 0; i < source.length; i++) {
    const item = source[i];

    if (item.value.toLowerCase().includes(name)) {
      list.push(item);

      if (list.length >= 50) {
        break;
      }
    }
  }
}

export function autoComplete(word: string): AutoComplete[] {
  const list = [];

  if (word[0] === "/") {
    add(word.substr(1), list, commandItems);
  } else if (word[0] === ":" && word.length > 2) {
    add(word.substr(1), list, emojisItems);
  } else if (word[0] === "@") {
    const name = word.substr(1);
    const visited = [];

    for (const item of store.state.users.users) {
      const itemName = item.name.toLowerCase();

      if (visited.indexOf(itemName) !== -1) {
        continue;
      }

      visited.push(itemName);

      if (itemName.toLowerCase().includes(name)) {
        list.push({
          text: item.name,
          textLowerCased: itemName,
          avatar: item.avatarUrl,
          value: "@" + item.name,
        });

        if (list.length >= 50) {
          break;
        }
      }
    }
  }

  return list.sort((a,b) => (a.textLowerCased > b.textLowerCased)
    ? 1
    : ((b.textLowerCased > a.textLowerCased) ? -1 : 0))
}
