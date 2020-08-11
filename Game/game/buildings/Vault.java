package buildings;

public class Vault extends Building {

	private int goldCapacity;

	public Vault() {
		super();
		super.name = "Vault";
		super.maxLevel = 20;
		this.goldCapacity = 10000;

		// TODO Auto-generated constructor stub
	}

	public int getGoldCapacity() {
		return goldCapacity;
	}

	public void setGoldCapacity(int goldCapacity) {
		this.goldCapacity = goldCapacity;
	}

}
