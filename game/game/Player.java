
package game;

import java.util.HashMap;

public class Player {

	private int id;
	private String playerDisplayName;
	private String email;
	private String faction;
	private String firstVillageName;
	private HashMap<String, Village> villageList;
	private Leader leader;

	public Player(int id, String playerDisplayName, String email, String faction, String firstVillageName) {

		id = 5;
		this.playerDisplayName = playerDisplayName;
		this.email = email;
		this.faction = faction;
		this.firstVillageName = firstVillageName;
		this.villageList = new HashMap<String, Village>();
		Village village = new Village(firstVillageName);
		villageList.put(firstVillageName, village);
		this.setLeader(null);

	}

	@Override
	public String toString() {
		return "Player [id=" + id + ", playerDisplayName=" + playerDisplayName + ", email=" + email + ", race="
				+ faction + ", firstVillageName=" + firstVillageName + ", villageList=" + villageList + "]";
	}

	public int getID() {
		return this.id;
	}

	public String getDisplayName() {
		return this.playerDisplayName;
	}

	public String getEmail() {
		return this.email;
	}

	public String getRace() {
		return this.faction;
	}

	public void setDisplayName(String newDisplayName) {
		this.playerDisplayName = newDisplayName;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Village getVillages(String string) {
		return villageList.get(string);
	}

	public HashMap<String, Village> getVillageList() {
		return villageList;
	}

	public void addVillage(String name) {
		Village v = new Village(name);
		villageList.put(name, v);
	}

	public Leader getLeader() {
		return leader;
	}

	public void setLeader(Leader leader) {
		this.leader = leader;
	}

}
