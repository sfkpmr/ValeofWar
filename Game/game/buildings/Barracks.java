package buildings;

import game.Village;
import soldiers.*;

public class Barracks extends Building {

	public Barracks() {
		super.name = "barracks";
		super.description = "training units";
		// TODO Auto-generated constructor stub
	}

	public void train(Village v, String s, int quantity) {

		Soldier unitToTrain;

		if (s.equalsIgnoreCase("Archer")) {
			unitToTrain = new Archer();
		} else if (s.equalsIgnoreCase("Swordsman")) {
			unitToTrain = new Swordsman();
		} else {
			throw new IllegalArgumentException("No such unit!");
		}

		int totalGoldCost = unitToTrain.getGoldCost() * quantity;
		int totalIronCost = unitToTrain.getIronCost() * quantity;
		int totalLumbeCost = unitToTrain.getLumberCost() * quantity;
		int totalGrainCost = unitToTrain.getGrainCost() * quantity;

		if (v.getGold() >= totalGoldCost && v.getGrain() >= totalGrainCost && v.getIron() >= totalIronCost
				&& v.getLumber() >= totalLumbeCost && v.getRecruits() >= quantity) {
			for (int i = 0; i < quantity; i++) {

				if (v.getArmy().isEmpty()) {
					v.getArmy().put(0, unitToTrain);
				} else {
					v.getArmy().put(v.getArmy().size(), unitToTrain);
				}

			}
			v.payGrain(totalGrainCost);
			v.payGold(totalGoldCost);
			v.payLumber(totalLumbeCost);
			v.payIron(totalIronCost);
			v.payRecruits(quantity);

			// TODO don't display 0 resource costs
			System.out.println(quantity + " " + unitToTrain.getNamePlural().toLowerCase()
					+ " were trained for a total cost of " + totalGoldCost + " gold, " + totalGrainCost + " grain, "
					+ totalIronCost + " iron and " + totalLumbeCost + " lumber.");

		} else if (quantity > v.getRecruits()) {
			System.out.println("You don't have enough recruits!");
		} else {
			System.out.println("You can't afford to train these troops!");
		}

	}

}
