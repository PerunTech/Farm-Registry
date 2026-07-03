import CadparcelWrapper from './CadparcelWrapper'
import ControlDocumentsWrapper from './ControlDocumentsWrapper'
import DocumentsWrapper from './DocumentsWrapper'
import FarmWrapper from './FarmWrapper'
import FeesWrapper from './FeesWrapper'
import GmpauditproductWrapper from './GmpauditproductWrapper'
import HoldingWrapper from './HoldingWrapper'
import PrescriptionmedicineWrapper from './PrescriptionmedicineWrapper'
import PrescriptionvetWrapper from './PrescriptionvetWrapper'
import RecordSelectWrapper from './RecordSelectWrapper'
import VmpPrescriptionWrapper from './VmpPrescriptionWrapper'

export const wrapperMap = {
  Cadparcel: CadparcelWrapper,
  Controldocuments: ControlDocumentsWrapper,
  Documents: DocumentsWrapper,
  Farm: FarmWrapper,
  Fees: FeesWrapper,
  Gmpauditproduct: GmpauditproductWrapper,
  Holding: HoldingWrapper,
  Prescriptionmedicine: PrescriptionmedicineWrapper,
  Prescriptionvet: PrescriptionvetWrapper,
  RecordSelectWrapper: RecordSelectWrapper,
  Vmpprescription: VmpPrescriptionWrapper,
}
