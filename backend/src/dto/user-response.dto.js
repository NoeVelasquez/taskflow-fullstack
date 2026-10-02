export function toUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
