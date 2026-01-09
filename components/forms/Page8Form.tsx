"use client";

import { useEvent } from "@/context/EventContext";
import { Label, Input, Row } from "@/components/card/UI";

export function Page8Form() {
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
    <div className="bg-white p-6">
      <div className="space-y-6">
        {/* Contacts - Grouped */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <Label>Contacts (Additional Settings)</Label>
            <button
              onClick={addContact}
              className="px-3 py-1 rounded-full bg-[#36463A] text-white text-xs shadow hover:bg-[#2d3a2f]"
            >
              + Add Contact
            </button>
          </div>
          <div className="space-y-3">
            {event.contacts.map((contact, index) => (
              <div key={index} className="border border-[#36463A] rounded-xl p-3">
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
    </div>
  );
}


