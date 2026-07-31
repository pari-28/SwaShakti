import {
  EmergencyContact,
  CreateEmergencyContact,
  UpdateEmergencyContact,
} from "../types/emergency";

const API_BASE = "http://localhost:5001/api/emergency";

const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  const response = await fetch(API_BASE, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data.data;
}

export async function addEmergencyContact(
  contact: CreateEmergencyContact
): Promise<EmergencyContact> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(contact),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data.data;
}

export async function updateEmergencyContact(
  id: string,
  contact: UpdateEmergencyContact
): Promise<EmergencyContact> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(contact),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data.data;
}

export async function deleteEmergencyContact(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);
}

export async function setPrimaryContact(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}/primary`, {
    method: "PATCH",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);
}