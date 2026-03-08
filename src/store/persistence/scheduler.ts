import { persist as persistSessions } from "./session";
import { persist as persistUsers } from "./user";

export default function scheduler() {
  setInterval(() => {
    persistUsers();
    persistSessions();
  }, 500);
}
