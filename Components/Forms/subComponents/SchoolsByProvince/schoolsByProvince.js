import easternCapeSchools from "./EasternCapeSchools";
import freeStateSchools from "./FreeStateSchools";
import gautengSchools from "./GautengSchools";
import kwaZuluNatalSchools from "./KwaZuluNatalSchools";
import limpopoSchools from "./LimpopoSchools";
import mpumalangaSchools from "./MpumalangaSchools";
import northernCapeSchools from "./NorthernCapeSchools";
import northWestSchools from "./NorthWestSchools";
import westernCapeSchools from "./WesternCapeSchools";

const schoolsByProvince = {
  "Eastern Cape": easternCapeSchools,
  "Free State": freeStateSchools,
  "Gauteng": gautengSchools,
  "KwaZulu-Natal": kwaZuluNatalSchools,
  "Limpopo": limpopoSchools,
  "Mpumalanga": mpumalangaSchools,
  "Northern Cape": northernCapeSchools,
  "North West": northWestSchools,
  "Western Cape": westernCapeSchools,
  "Other":[{label:"School/institution is not here",value:"not in the database"}]
};

export { schoolsByProvince };
export default schoolsByProvince;
