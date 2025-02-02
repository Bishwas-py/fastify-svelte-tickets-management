import type {Handle} from "@sveltejs/kit";
import {$api} from "$lib/server/utils";
import type {User} from "$lib/models/user";
import {sequence} from "@sveltejs/kit/hooks";


const handleCurrentUser: Handle = async ({event, resolve}) => {
  const session_id = event.cookies.get('session_id');
  if (session_id) {
    const response = await event.fetch($api('get-user'), {
      headers: {
        'Content-Type': 'application/json',
        'session_id': session_id
      },
    })
    if (response.ok) {
      event.locals.user = await response.json() as User;
    }
  }
  return resolve(event);
};

export const handle = sequence(handleCurrentUser,);