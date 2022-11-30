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
    forma.addEventListener(
      "submit", guarda);
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
    const matricula = getString(
        formData, "matricula").trim();  
    const nombre = getString(formData, "nombre").trim();
    const telefono = getString(formData, "telefono").trim();
    const grupo = getString(formData, "grupo").trim();
    const nacimiento = getString(formData, "nacimiento").trim();
    /**
     * @type {
        import("./tipos.js").
                Mascota} */
    const modelo = {
      matricula,
      nombre,
      telefono,
      grupo,
      nacimiento 
    };
    await daoMascota.
      add(modelo);
    muestraMascotas();
  } catch (e) {
    muestraError(e);
  }
}

