import { redirect } from "react-router-dom";

// Only POST requests should be accepted on this route,
// so throw 405 on GET
export function loader({ params }) {
  throw new Response("GET Not Allowed", { status: 405 });
}

// Deletes the pet from local storage if it exists there
export async function action({ request }) {
  const formData = await request.formData();
  const petName = Object.fromEntries(formData).petName;

  // Delete the pet from local storage
  localStorage.removeItem(petName);

  // Rerender the save slot page
  return redirect("/");
}
