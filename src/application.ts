export default class Application {
  public connectDB = async (): Promise<void> => {
    try {
      console.log('Connected to DB');
    } catch (error) {
      console.error('Could not connect to the database', error);
    }
  };
}
