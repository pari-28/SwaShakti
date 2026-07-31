import { Phone, User, Star, Pencil, Trash2 } from "lucide-react";
import { EmergencyContact } from "../types/emergency";

interface ContactCardProps {
  contact: EmergencyContact;
  onEdit: (contact: EmergencyContact) => void;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
}

export default function ContactCard({
  contact,
  onEdit,
  onDelete,
  onSetPrimary,
}: ContactCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">

      <div className="flex justify-between items-start">

        <div className="flex items-start gap-4">

          {/* Avatar */}
          <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center">
            <User className="text-purple-600 h-7 w-7" />
          </div>

          <div>

            <div className="flex items-center gap-2 flex-wrap">

              <h2 className="text-xl font-bold text-slate-800">
                {contact.name}
              </h2>

              {contact.isPrimary && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  <Star className="h-3 w-3 fill-current" />
                  Primary
                </span>
              )}

            </div>

            <p className="text-slate-500 mt-1">
              {contact.relation}
            </p>

            <div className="flex items-center gap-2 mt-3 text-slate-700">

              <Phone className="h-4 w-4 text-purple-600" />

              <span className="font-medium">
                {contact.countryCode} {contact.phone}
              </span>

            </div>

          </div>

        </div>

      </div>

      <div className="border-t border-slate-200 mt-6 pt-5 flex flex-wrap gap-3">

        {!contact.isPrimary && (

          <button
            onClick={() => onSetPrimary(contact.id)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition"
          >
            <Star className="h-4 w-4" />
            Make Primary
          </button>

        )}

        <button
          onClick={() => onEdit(contact)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>

        <button
          onClick={() => onDelete(contact.id)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>

      </div>

    </div>
  );
}