"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input, Row } from "@/components/card/UI";

export function CeremonyEditor() {
  const { event, updateEvent } = useEvent();

  const handleContactChange = (index: number, field: "name" | "phone", value: string) => {
    const newContacts = [...event.contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    updateEvent({ contacts: newContacts });
  };

  const addContact = () => {
    updateEvent({
      contacts: [...event.contacts, { name: "", phone: "" }],
    });
  };

  const removeContact = (index: number) => {
    if (event.contacts.length > 1) {
      const newContacts = event.contacts.filter((_, i) => i !== index);
      updateEvent({ contacts: newContacts });
    }
  };

  return (
    <div className="space-y-4">
      {/* Event Title (full) */}
      <div>
        <Label>Event Title (Full)</Label>
        <Input
          value={event.title}
          onChange={(e) => updateEvent({ title: e.target.value })}
          placeholder="Majlis Aqiqah Aqil"
        />
      </div>

      {/* ISO Date/Time Fields for Calendar */}
      <Row>
        <div>
          <Label>Start Time (ISO 8601)</Label>
          <Input
            value={event.startISO}
            onChange={(e) => updateEvent({ startISO: e.target.value })}
            placeholder="2025-10-29T11:00:00+08:00"
          />
        </div>
        <div>
          <Label>End Time (ISO 8601)</Label>
          <Input
            value={event.endISO}
            onChange={(e) => updateEvent({ endISO: e.target.value })}
            placeholder="2025-10-29T15:00:00+08:00"
          />
        </div>
      </Row>

      {/* Map Query */}
      <div>
        <Label>Map Query</Label>
        <Input
          value={event.mapQuery}
          onChange={(e) => updateEvent({ mapQuery: e.target.value })}
          placeholder="Dewan Seri Melati, Putrajaya"
        />
      </div>

      {/* Contacts */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Contacts</Label>
          <button
            onClick={addContact}
            className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs shadow hover:bg-rose-700"
          >
            + Add Contact
          </button>
        </div>
        <div className="space-y-3">
          {event.contacts.map((contact, index) => (
            <div key={index} className="border border-rose-200 rounded-xl p-3">
              <Row>
                <div>
                  <Label>Name</Label>
                  <Input
                    value={contact.name}
                    onChange={(e) => handleContactChange(index, "name", e.target.value)}
                    placeholder="Contact name"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="flex gap-2">
                    <Input
                      value={contact.phone}
                      onChange={(e) => handleContactChange(index, "phone", e.target.value)}
                      placeholder="+60123456789"
                    />
                    {event.contacts.length > 1 && (
                      <button
                        onClick={() => removeContact(index)}
                        className="px-3 py-2 rounded-xl border border-red-300 text-red-700 text-sm hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </Row>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

