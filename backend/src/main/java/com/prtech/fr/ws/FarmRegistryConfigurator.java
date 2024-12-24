package com.prtech.fr.ws;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import com.prtech.svarog_interfaces.ISvConfigurationMulti;
import com.prtech.svarog_interfaces.ISvCore;

import org.apache.logging.log4j.Logger;

import com.google.gson.JsonObject;
import com.prtech.svarog.SvConf;
import com.prtech.svarog.SvCore;
import com.prtech.svarog.SvException;
import com.prtech.svarog.SvReader;
import com.prtech.svarog.SvWriter;
import com.prtech.svarog.svCONST;
import com.prtech.svarog_common.DbDataArray;
import com.prtech.svarog_common.DbDataObject;
import com.prtech.svarog_common.DbSearchCriterion;
import com.prtech.svarog_common.DbSearchCriterion.DbCompareOperand;

public class FarmRegistryConfigurator implements ISvConfigurationMulti {

	static final Logger log4j = SvConf.getLogger(FarmRegistryConfigurator.class);
	
	SvReader svr = null;
	SvWriter svw = null;

	@Override
	public int executionOrder(UpdateType updateType) {
		return 0;
	}

	@Override
	public String beforeSchemaUpdate(Connection conn, ISvCore core, String schema) throws Exception {
		return null;
	}

	@Override
	public String beforeLabelsUpdate(Connection conn, ISvCore core, String schema) throws Exception {
		return null;
	}

	@Override
	public String beforeCodesUpdate(Connection conn, ISvCore core, String schema) throws Exception {
		return null;
	}

	@Override
	public String beforeTypesUpdate(Connection conn, ISvCore core, String schema) throws Exception {
		return null;
	}

	@Override
	public String beforeLinkTypesUpdate(Connection conn, ISvCore core, String schema) throws Exception {
		return null;
	}

	@Override
	public String beforeAclUpdate(Connection conn, ISvCore core, String schema) throws Exception {

		return null;
	}

	@Override
	public String beforeSidAclUpdate(Connection conn, ISvCore core, String schema) throws Exception {
		return null;
	}

	@Override
	public String afterUpdate(Connection conn, ISvCore core, String schema) throws Exception {
		try (SvReader svr1 = new SvReader((SvCore) core); SvWriter svw1 = new SvWriter(svr1);) {
			svw = svw1;
			svr = svr1;
			svw.setAutoCommit(false);
			svw.dbCommit();
		}
		return null;
	}
	

	@Override
	public int getVersion(int currentVersion) {
		return 3;
	}

	@Override
	public List<UpdateType> getUpdateTypes() {
		List<UpdateType> types = new ArrayList<UpdateType>();
		types.add(UpdateType.FINAL);
		return types;
	}

}
