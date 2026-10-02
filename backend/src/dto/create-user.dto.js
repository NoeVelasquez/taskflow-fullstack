export function createUserDto(body) {
  return {
    name: body.name,
    email: body.email,
    password: body.password,
  };
}
