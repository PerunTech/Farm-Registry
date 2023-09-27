package com.prtech.fr.ws;

import java.util.Map;

import org.joda.time.DateTime;
import org.apache.logging.log4j.Logger;
import com.google.gson.JsonObject;
import com.prtech.svarog.SvConf;
import com.prtech.svarog.SvCore;
import com.prtech.svarog.SvException;
import com.prtech.svarog.SvReader;
import com.prtech.svarog_interfaces.ISvCore;
import com.prtech.svarog_interfaces.ISvExecutor;

public class LandUseCodeExecutor implements ISvExecutor {

	static final Logger log4j = SvConf.getLogger(LandUseCodeExecutor.class);
	
	private static final String CATEGORY = CC.LAND_USE;
	private static final String NAME = "GET_LAND_USE_CODES";
	private static final String DESCRIPTION = "Get land use codes per year and land_cover";
	private static final DateTime START = new DateTime();
	private static final DateTime END = new DateTime(CC.MAX_DATETIME);
	private static final Class<?> TYPE = JsonObject.class;

	@Override
	public long versionUID() {
		return 1L;
	}

	@Override
	public Class<?> getReturningType() {
		// TODO Auto-generated method stub
		return TYPE;
	}

	@Override
	public String getCategory() {
		// TODO Auto-generated method stub
		return CATEGORY;
	}

	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return NAME;
	}

	@Override
	public String getDescription() {
		// TODO Auto-generated method stub
		return DESCRIPTION;
	}

	@Override
	public DateTime getStartDate() {
		// TODO Auto-generated method stub
		return START;
	}

	@Override
	public DateTime getEndDate() {
		// TODO Auto-generated method stub
		return END;
	}

	@Override
	public Object execute(Map<String, Object> params, ISvCore svCore) throws SvException {
		JsonObject jObjectResult;
		try (SvReader svr = new SvReader((SvCore) svCore)) {
			DbReader rdr = new DbReader();
			jObjectResult = rdr.getSpecificLandUseCodesMainMethod(svr, (Integer) params.get("year"),
					(Integer) params.get("landCover"), (Boolean) params.get("includeOnlyBasic"),
					(Boolean) params.get("includeOtscCrops"));
		}
		return jObjectResult;
	}

}
