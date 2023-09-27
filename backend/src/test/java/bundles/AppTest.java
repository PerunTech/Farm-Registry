package bundles;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.prtech.fr.ws.DbReader;
import com.prtech.perun_core.ws.Rc;
import com.prtech.svarog.SvCore;
import com.prtech.svarog.SvException;
import com.prtech.svarog.SvReader;
import com.prtech.svarog.SvSecurity;
import com.prtech.svarog.SvUtil;
import com.prtech.svarog_common.DbDataObject;

/**
 * Unit test for simple App.
 */

public class AppTest {
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    @Test
	public void getLandUseByLandCover() {
		try {
			SvSecurity svs = new SvSecurity();
			String token = svs.logon("ADMIN", SvUtil.getMD5("welcome"));
			SvReader svr = new SvReader(token);
			DbReader rdr = new DbReader();
			JsonObject jObjectResult = rdr.getSpecificLandUseCodesMainMethod(svr, 2022,
					410, false,true);
			System.out.println(jObjectResult.toString());
			//System.out.println(getLandUseByLandCover.toString().equals(jObjectResult.toString()));


		} catch (SvException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
    @Test
	public void testImportbyFic() {
		System.out.println("before test 1");

		SvSecurity svSec = null;
		try {
			svSec = new SvSecurity();
			String token = svSec.logon("96821255883", SvUtil.getMD5("96821255883"));
			SvReader svr = new SvReader(token);
			DbDataObject appDbo = svr.getObjectById(660219250L, SvCore.getTypeIdByName("APPLICATION"), null);
			if (appDbo != null) {
				Map<String, Object> params = new HashMap<String, Object>();
				params.put("RECORD", appDbo);
				JsonArray jsonParamsArray = new JsonArray();
				params.put("JSON_PARAMS", jsonParamsArray.toString());
				SvCore svc = (SvCore) svr;
				params.put("isUnitTest", true);
				params.put("farmId", 692014988L);
				//(Long) params.get("farmId")
				//ImporterSDIByFarmExe hex = new ImporterSDIByFarmExe();
				//hex.execute(params, svc);
				System.out.println("finished");
			}
		} catch (SvException e) {
			System.out.println(e.getFormattedMessage());
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}

		System.out.println("test 1 finished");
	}
	

}
