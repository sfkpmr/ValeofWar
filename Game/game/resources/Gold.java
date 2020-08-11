package resources;

public class Gold extends Resource {

	public Gold() {
		super();
		super.name = "Gold";
		super.description = "Gold is a very important resource.";
		// TODO Auto-generated constructor stub
	}

	public int getProduction() {
		return this.level * 10;
	}

}
