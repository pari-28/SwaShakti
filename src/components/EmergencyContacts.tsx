import { useEffect, useState } from "react";
import ContactCard from "./ContactCard";
import ContactModal from "./ContactModal";

import {
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  setPrimaryContact,
} from "../services/emergency";

import { EmergencyContact } from "../types/emergency";

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] =
    useState<EmergencyContact | null>(null);

  async function loadContacts() {
    try {
      setLoading(true);
      const data = await getEmergencyContacts();
      setContacts(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  async function handleSave(data: {
    name: string;
    phone: string;
    relation: string;
  }) {
    try {
      if (editingContact) {
        await updateEmergencyContact(editingContact.id, data);
      } else {
        await addEmergencyContact(data);
      }

      setEditingContact(null);
      loadContacts();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this contact?")) return;

    try {
      await deleteEmergencyContact(id);
      loadContacts();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handlePrimary(id: string) {
    try {
      await setPrimaryContact(id);
      loadContacts();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Emergency Contacts
        </h1>

        <button
          onClick={() => {
            setEditingContact(null);
            setModalOpen(true);
          }}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"
        >
          + Add Contact
        </button>

      </div>

      {loading ? (
        <p>Loading...</p>
      ) : contacts.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow">
          No emergency contacts added.
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onDelete={handleDelete}
              onSetPrimary={handlePrimary}
              onEdit={(c) => {
                setEditingContact(c);
                setModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <ContactModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingContact(null);
        }}
        contact={editingContact}
        onSave={handleSave}
      />

    </div>
  );
}