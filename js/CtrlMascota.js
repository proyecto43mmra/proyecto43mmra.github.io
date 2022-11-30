import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraMascotas
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoMascota =
  getFirestore().
    collection("Mascota");
const params =
  new URL(location.href).
    searchParams;
const id = params.get("id");
/** @type {HTMLFormElement} */
const forma = document["forma"];

getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    busca();
  }
}

/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
  try {
    const doc =
      await daoMascota.
        doc(id).
        get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  Mascota} */
      const data = doc.data();
      forma.animal.value = data.animal;
      forma.nombre.value = data.nombre || "";
      forma.peso.value = data.peso || "";
      forma.raza.value = data.raza || "";
      forma.nacimiento.value = data.nacimiento || "";
      forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener(
          "click", elimina);
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraMascotas();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
    const animal = getString(
        formData, "animal").trim();  
    const nombre = getString(formData, "nombre").trim();
    const peso = getString(formData, "peso").trim();
    const raza = getString(formData, "raza").trim();
    const nacimiento = getString(formData, "nacimiento").trim();
    /**
     * @type {
        import("./tipos.js").
                Mascota} */
    const modelo = {
      animal, 
      nombre,
      peso,
      raza,
      nacimiento
    };
    await daoMascota.
      doc(id).
      set(modelo);
    muestraMascotas();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoMascota.
        doc(id).
        delete();
      muestraMascotas();
    }
  } catch (e) {
    muestraError(e);
  }
}

