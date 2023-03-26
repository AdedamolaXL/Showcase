import { Polybase } from "@polybase/client"

const db = new Polybase({ defaultNamespace: "pk/0x476e90ba4facb03930c0a97fc4c3271e845d3a3f59cfb827f516e10eedeb847a6ad77807b40c59833aadafecf47535274f564f48fa4e3c1086b556270d3444c6/Showcase" });
const collectionReference = db.collection("Projects");

async function createRecord () {
  // .create(args) args array is defined by the constructor fn
  const recordData = await collectionReference.create([
    "1",
    "XDAO",
    "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
    "0.1eth",
    db.collection("Owner").record("admin")
  ]);
}

export async function listRecords () {
  const records = await collectionReference.get();
}