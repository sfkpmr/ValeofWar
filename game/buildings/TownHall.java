package buildings;

import game.Player;
import game.Village;

public class TownHall extends Building {

	public TownHall() {
		super();
		// TODO Auto-generated constructor stub
	}

	public void upgradeLeaderAttackBonus(Village v, Player p) {

		if (p.getLeader().getLevel() == 0) {
			System.out.println("Your leader needs to be level 1 to train.");
		} else if (v.getGold() >= 1000 * p.getLeader().getLevel() && this.getLevel() == p.getLeader().getLevel() + 1) {
			p.getLeader().setAttackModifierLevel(p.getLeader().getLevel() + 1);
		}

	}

}
