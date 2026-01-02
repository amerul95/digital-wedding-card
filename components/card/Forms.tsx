import React from "react";
import { FormData } from "./types";
import { Label, Input, Textarea, Row } from "./UI";

interface FormProps {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: () => void;
  onCancel: () => void;
}

export function FormHadir({ form, setForm, onSubmit, onCancel }: FormProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-rose-700 mb-4">Sahkan Kehadiran – Hadir</h3>
      <div className="space-y-3">
        <div>
          <Label>Nama</Label>
          <Input
            value={form.nama}
            onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
            placeholder="Nama penuh"
          />
        </div>
        <Row>
          <div>
            <Label>No. Telefon</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="0123456789"
            />
          </div>
          <div>
            <Label>Jumlah Kehadiran</Label>
            <Input
              type="number"
              min={1}
              value={form.jumlah}
              onChange={(e) => setForm((f) => ({ ...f, jumlah: Number(e.target.value || 1) }))}
            />
          </div>
        </Row>
        <div>
          <Label>Ucapan Tahniah (optional)</Label>
          <Textarea
            rows={3}
            value={form.ucapan}
            onChange={(e) => setForm((f) => ({ ...f, ucapan: e.target.value }))}
            placeholder="Titipkan ucapan ringkas di sini"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-5">
        <button
          className="px-4 py-2 rounded-full border border-rose-300 text-rose-700 bg-white text-sm"
          onClick={onCancel}
        >
          Batal
        </button>
        <button className="px-4 py-2 rounded-full bg-rose-600 text-white text-sm" onClick={onSubmit}>
          Hantar
        </button>
      </div>
    </div>
  );
}

export function FormTidak({ form, setForm, onSubmit, onCancel }: FormProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-rose-700 mb-4">Sahkan Kehadiran – Tidak Hadir</h3>
      <div className="space-y-3">
        <div>
          <Label>Nama</Label>
          <Input
            value={form.nama}
            onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
            placeholder="Nama penuh"
          />
        </div>
        <div>
          <Label>No. Telefon</Label>
          <Input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="0123456789"
          />
        </div>
        <div>
          <Label>Ucapan Tahniah (optional)</Label>
          <Textarea
            rows={3}
            value={form.ucapan}
            onChange={(e) => setForm((f) => ({ ...f, ucapan: e.target.value }))}
            placeholder="Titipkan ucapan ringkas di sini"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-5">
        <button
          className="px-4 py-2 rounded-full border border-rose-300 text-rose-700 bg-white text-sm"
          onClick={onCancel}
        >
          Batal
        </button>
        <button className="px-4 py-2 rounded-full bg-rose-600 text-white text-sm" onClick={onSubmit}>
          Hantar
        </button>
      </div>
    </div>
  );
}

export function FormUcapan({ form, setForm, onSubmit, onCancel }: FormProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-rose-700 mb-4">Tulis Ucapan Tahniah</h3>
      <div className="space-y-3">
        <div>
          <Label>Nama</Label>
          <Input
            value={form.nama}
            onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
            placeholder="Nama anda"
          />
        </div>
        <div>
          <Label>Ucapan</Label>
          <Textarea
            rows={4}
            value={form.ucapan}
            onChange={(e) => setForm((f) => ({ ...f, ucapan: e.target.value }))}
            placeholder="Tinggalkan ucapan indah anda di sini"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-5">
        <button
          className="px-4 py-2 rounded-full border border-rose-300 text-rose-700 bg-white text-sm"
          onClick={onCancel}
        >
          Batal
        </button>
        <button className="px-4 py-2 rounded-full bg-rose-600 text-white text-sm" onClick={onSubmit}>
          Hantar
        </button>
      </div>
    </div>
  );
}

