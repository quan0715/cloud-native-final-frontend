import type { Machine } from '@/types/machine'
const base = import.meta.env.VITE_API_BASE_URL
const headers = { 'Content-Type': 'application/json' }
const machineEndPoint = `${base}/machines`
export async function fetchMachines(): Promise<Machine[]> {
  try {
    const res = await fetch(machineEndPoint, {
      headers,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as Machine[]
  } catch (e) {
    throw new Error(`
      fetchMachines error: ${e}
    `)
  }
}

export async function createMachine(newMachine: {
  machineName: string
  machine_task_types: string[]
}): Promise<Machine> {
  const res = await fetch(machineEndPoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(newMachine),
  })
  if (!res.ok) {
    const resJson = await res.json()
    if (resJson.error) throw new Error(resJson.error)
    else throw new Error(`HTTP ${res.status}`)
  }
  return (await res.json()) as Machine
}

export async function updateMachine(machine: {
  _id: string
  machineName: string
  machine_task_types: string[]
}): Promise<Machine> {
  const res = await fetch(`${machineEndPoint}/${machine._id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(machine),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as Machine
}

export async function deleteMachine(machineId: string): Promise<void> {
  const base = import.meta.env.VITE_API_BASE_URL
  const res = await fetch(`${base}/machines/${machineId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}
