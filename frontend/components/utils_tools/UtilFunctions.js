import { getPluginLabel } from './LabelsExport'

export const updateIdScreen = (context) => {
  const idScreen = document.getElementById('identificationScreen')
  if (idScreen) {
    idScreen.innerText = getPluginLabel('farm_registry', context)
  }
}

export const generateDynamicKey = () => {
  return Math.floor(Math.random() * 999999).toString(36)
}

export const replaceFunc = (wsPath, id, obj) => {
  if (wsPath.indexOf(`{${id}.OBJECT_ID}`) >= 0) {
    wsPath = wsPath.replace(`{${id}.OBJECT_ID}`, obj)
    return wsPath
  } else {
    return wsPath
  }
}

