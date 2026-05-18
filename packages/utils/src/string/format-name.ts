type NameInput = { firstName: string; lastName: string };

/**
 * Returns `"Firstname Lastname"`, trimming whitespace.
 */
export const formatFullName = ({ firstName, lastName }: NameInput): string =>
  `${firstName.trim()} ${lastName.trim()}`.trim();
