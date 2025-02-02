import type {PageServerLoad} from './$types.js';
import {message, superValidate} from 'sveltekit-superforms';
import {formSchema} from './schema';
import {zod} from 'sveltekit-superforms/adapters';
import {type Actions, fail, redirect} from '@sveltejs/kit';
import type {Message} from "$lib/models/message";
import {$api} from "$lib/server/utils";

interface SignupData {
  _id: string;
  expiredAt: string;
  user_id: string
}

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(formSchema));

  return {
    form,
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));

    if (!form.valid) {
      return fail(400, {form});
    }

    let response: Response;

    try {
      response = await fetch($api('signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.data),
      });
    } catch (error) {
      console.error(error);

      const errorMessage: Message = {
        type_: 'fail',
        message: 'Internal error!',
      };
      return message(form, errorMessage, {
        status: 500,
      });
    }

    const result = await response.json();

    if (response.ok) {
      const {_id: sessionId, expiredAt} = result as SignupData;

      event.cookies.set('session_id', sessionId, {
        expires: new Date(expiredAt),
        path: '/',
      });

      throw redirect(302, '/');
    }

    const error: Message = result || {
      type_: 'fail',
      message: 'Failed',
    };

    return message(form, error, {
      status: 400,
    });
  },
};