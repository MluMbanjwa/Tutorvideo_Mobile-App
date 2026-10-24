South African schools split by province

Example import:
import schoolsByProvince from "./schools/SchoolsByProvince/schoolsByProvince";

const schools = schoolsByProvince[location] || [];

<UserDropdown
  name="School"
  data={schools}
  value={school}
  setValue={setSchool}
  search
/>
