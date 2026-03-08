import syncUsers from "../usecase/syncUsers";

export async function handleReady(): Promise<void> {
  await syncUsers();
}

export default handleReady;
