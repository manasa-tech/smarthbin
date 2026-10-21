const PROFILE_KEY = "smartbin_user_profile";

export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  const updated = {
    ...(getProfile() || {}),
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  return updated;
}
