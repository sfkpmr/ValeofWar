package buildings;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import game.Player;
import game.Village;

public class Market extends Building {

	public Market() {

		super.name = "Market";
		super.description = "The market is used for buying and selling resources, as well as transferring resources to other villages.";
		super.maxLevel = 1;
	}

	// TODO going market rate
	double marketRate = 0.1;

	public void sellStone(Village v, int i) {

		v.payStone(i);
		v.addGold(i * marketRate);

	}

	public void transferStone(Village sendFrom, Village sendTo, int amount) {

		if (sendTo.getBuilding("Market") != null) {
			sendFrom.payStone(amount);
			sendTo.addStone(amount);
		} else {
			System.out.println(sendTo.getName() + " does not have a market!");
		}

	}

	public void gatherAllResources(Player p, Village currentVillage) {

		// TOOD warning max warehouse capacity

		double allGold = 0;
		double allStone = 0;
		double allLumber = 0;
		double allGrain = 0;
		double allIron = 0;

		// https://stackoverflow.com/a/9009709
		// HashMap<String, Village> temp = p.getVillageList();

		for (Entry<String, Village> entry : p.getVillageList().entrySet()) {
			// String key = entry.getKey(); // TODO needed?

			allGold += entry.getValue().getGold();
			allStone += entry.getValue().getStone();
			allLumber += entry.getValue().getLumber();
			allGrain += entry.getValue().getGrain();
			allIron += entry.getValue().getIron();

			entry.getValue().removeAllResources();

		}

		currentVillage.addGold(allGold);
		currentVillage.addStone(allStone);
		currentVillage.addGrain(allGrain);
		currentVillage.addLumber(allLumber);
		currentVillage.addIron(allIron);

	}

}
