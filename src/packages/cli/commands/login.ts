import { cli } from 'cli-ux';

export async function login() {
  const username = await cli.prompt('Username', { required: true });
  const password = await cli.prompt('Password', { required: true, type: 'hide' });
  console.log('cloud login', username, password);
}
