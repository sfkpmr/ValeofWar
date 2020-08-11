package game;

import java.util.HashMap;

import buildings.Building;
import buildings.Vault;

public class Game {

	public static void main(String[] args) {

		HashMap<Integer, Player> players = new HashMap<>();

		Player player = new Player(255, "Mike", "email@email", "human", "My First Village");

		players.put(0, player);

		System.out.println("hi");

		System.out.println(players.get(0).getDisplayName());

		player.addVillage("Rosdal");
		player.addVillage("Roshagen");

		System.out.println(players.get(0));
		System.out.println("-----------");
		System.out.println(players.get(0).getVillages("Rosdal"));

		players.get(0).getVillages("Rosdal").build("Barracks");
//		players.get(0).getVillages("Rosdal").build("sdf");

		System.out.println(players.get(0).getVillages("Rosdal").getBuildings());

		Village v = player.getVillages("Rosdal");
		System.out.println("-------");
		System.out.println(v);

		System.out.println(v.getArmy());

		System.out.println(v.getBarracks());
		System.out.println(v.getBuildings().get("Barracks"));

		v.getBarracks().train(v, "Archer", 5);
		v.getBarracks().train(v, "Archer", 500);

		System.out.println("Grain: " + v.getGrain() + " Gold: " + v.getGold());
		v.addGrain(50);
		System.out.println("Grain: " + v.getGrain() + " Gold: " + v.getGold());
		v.payGrain(100);
		System.out.println("Grain: " + v.getGrain() + " Gold: " + v.getGold());

		System.out.println(v.getArmy());
		System.out.println(v.getGoldIncome());

		v.build("Furnace");
		System.out.println(v.getBuildings());
		v.calculateGoldIncome();

		System.out.println(v.getGoldIncome());

		System.out.println(v.getArmyAttackValue(player));
		System.out.println(v.getArmyDefenseValue(player));
		v.attack(v, player);

		v.getFurnace().upgrade(v);
		System.out.println(v.getFurnace().getLevel());
		v.setGold(0);
		v.setStone(0);
		v.setGrain(0);
		v.setIron(0);
		v.setLumber(0);
		System.out.println(
				v.getGold() + " " + v.getLumber() + " " + v.getIron() + " " + v.getGrain() + " " + v.getStone());
		v.getFurnace().upgrade(v);
		System.out.println(v.getFurnace().getLevel());
		// v.getBarracks().train(v, "sgd", 5);

		players.get(0).getVillages("Rosdal").build("Market");
		System.out.println(v.getBuilding("Market"));

		System.out.println(v.getBuilding("gdfas"));
		v.build("Vault");
		System.out.println(v.getBuilding("Vault"));

		System.out.println(v.getBuilding("Vault").getLevel());
		v.getBuilding("Vault").upgrade(v);
		System.out.println(v.getBuilding("Vault").getLevel());

		Building temp = v.getBuilding("Vault");
		int temp2 = 0;

		if (temp instanceof Vault) {
			temp2 = ((Vault) v.getBuilding("Vault")).getGoldCapacity();
		}

		System.out.println(temp2);

	}

}
