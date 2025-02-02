import type {PageServerLoad} from "./$types.js";
import {message, superValidate} from "sveltekit-superforms";
import {formSchema} from "./schema";
import {zod} from "sveltekit-superforms/adapters";
import {type Actions, fail, redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.data),
    });

    const result = await response.json();

    if (response.ok) {
      // Return the error message from the API
      const session_id = result._id;
      const expiryAt = result.expiredAt;
      event.cookies.set(
        'session_id',
        session_id,
        {
          expires: new Date(expiryAt),
          path: '/'
        }
      )
      redirect(302, '/');
    }

    // Success case - return the form and success message
    return message(form, result || {
      type_: 'fail',
      message: 'Failed'
    }, {
      status: 400
    });
  },
};