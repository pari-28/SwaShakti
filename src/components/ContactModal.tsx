import { useEffect, useState } from "react";
import { EmergencyContact } from "../types/emergency";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    phone: string;
    relation: string;
  }) => void;
  contact?: EmergencyContact | null;
}

export default function ContactModal({
  open,
  onClose,
  onSave,
  contact,
}: ContactModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setPhone(contact.phone);
      setRelation(contact.relation);
    } else {
      setName("");
      setPhone("");
      setRelation("");
    }
  }, [contact]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !relation.trim()) {
      alert("Please fill all fields.");
      return;
    }

    onSave({
      name,
      phone,
      relation,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6">

        <h2 className="text-2xl font-bold mb-6">
          {contact ? "Edit Contact" : "Add Emergency Contact"}
        </h2>

        <div className="space-y-4">

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Relation"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            {contact ? "Update" : "Save"}
          </button>

        </div>
      </div>
    </div>
  );
}