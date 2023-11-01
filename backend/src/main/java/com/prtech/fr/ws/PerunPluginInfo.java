package com.prtech.fr.ws;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import com.prtech.svarog.SvException;
import com.prtech.svarog_interfaces.IPerunPlugin;
import com.prtech.svarog_interfaces.ISvCore;

public class PerunPluginInfo implements IPerunPlugin {

	static final String confPath = "configuration";
	static final String context = "farm-registry";

	@Override
	public int getVersion() {
		// TODO Auto-generated method stub
		return 52;
	}

	@Override
	public String getContextName() {
		// TODO Auto-generated method stub
		return context;
	}

	@Override
	public String getJsPluginUrl() {
		return "farm-registry.js";
	}

	@Override
	public String getIconPath() {
		return "/perun-assets/img/access_cards/fr.svg";
	}

	@Override
	public String getLabelCode() {
		// TODO Auto-generated method stub
		return "perun.plugin.farm_registry";
	}

	@Override
	public String getPermissionCode() {
		// TODO Auto-generated method stub
		return "card.farmRegistry_access";
	}

	@Override
	public int getSortOrder() {
		// TODO Auto-generated method stub
		return 11;
	}

	@Override
	public boolean replaceContextMenuOnNew() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public JsonObject getMenu(JsonObject existingMenu, ISvCore core) {
		JsonObject result = new JsonObject();
		SvException ex = null;
		try {
			if (existingMenu == null) {
				Gson gson = new Gson();
				ByteArrayOutputStream buffer = null;

				String strData = "";
				InputStream inputStream = getClass().getClassLoader()
						.getResourceAsStream(confPath + File.separator + "ModuleMenu.json");

				if (inputStream != null) {
					buffer = new ByteArrayOutputStream();
					int nRead;
					byte[] data = new byte[1024];
					while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
						buffer.write(data, 0, nRead);
					}

					byte[] byteArray = buffer.toByteArray();

					strData = new String(byteArray, StandardCharsets.UTF_8);

					existingMenu = gson.fromJson(strData, JsonObject.class);

					BundleMenu bdm = new BundleMenu(existingMenu, "perun.farm_registry.module_menu.navigation",
							"farm_registry.module_menu.items", core);

					result.add("module_menu", bdm.getResult());
					inputStream.close();
					buffer.close();

				} else {
					ex = new SvException("system.error.not_found_configuration", core.getInstanceUser());
					result.addProperty("error", ex.getJsonMessage());
				}
			} else {
				result = existingMenu;
			}

		} catch (JsonSyntaxException | JsonIOException | IOException e) {
			ex = new SvException("system.error.load_configuration", core.getInstanceUser(), e);
			result.addProperty("error", ex.getJsonMessage());
		}

		return result;
	}

	@Override
	public JsonObject getContextMenu(HashMap<String, String> contextMap, JsonObject existingMenu, ISvCore core) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean replaceMenuOnNew() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public List<String> dependencies() {
		List<String> deps = new ArrayList<String>();
			deps.add("lpis");
			deps.add("persons-registry");
		return deps;
	}

}
