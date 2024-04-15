export const getRect = (id: string | undefined) => {
  if (!id) return;
  return document.getElementById(id)?.getBoundingClientRect();
};
