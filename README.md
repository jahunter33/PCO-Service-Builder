# PCO-Service-Builder

PCO-Service-Builder is a tool designed to automate service planning, utilizing the APIs provided by Planning Center.

## Getting Started

Before you start, ensure you have [Node.js](https://nodejs.org/) installed on your machine.

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/PCO-Service-Builder.git
   cd pco-service-builder
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create an `.env` file in the root directory and populate it with your Planning Center Application ID and Secret. You should also specify your Service Type ID and Team ID:

   ```env
   APPLICATION_ID=your_application_id
   SECRET=your_secret
   SERVICE_TYPE_ID=your_service_type_id
   TEAM_ID=your_team_id
   ```

## Usage

This application can be used in two modes: as a command line interface (CLI) or through a web interface. Below are the instructions for both usage scenarios.

#### Command Line Interface

To run the command line interface version of the program, use the following command:

```bash
npm run cli
```

This will start the CLI version of the application, allowing you to interact with it directly from your terminal.

#### Web Interface

To use the web interface version of the application, yyou will need to start the server and then open the `index.html` file located in the client's `public` folder.

##### 1. Start the Server:

First, start the backend of the server by running:

```bash
npm run server
```

This command starts the server that the web interface will communicate with.

##### 2. Opening the Web Interface

After starting the server, navigate to the client>public folder and open the index.html file in a web browser.

For example, you can do this by locating the index.html file in your file explorer and double-clicking on it, or by entering the file path directly into your browser's address bar.

## Configuring Priorities

To modify the priority of a particular band member or player, you need to edit the preferences.json file located in the project root. This file contains each person's unique identifier and their associated priority level.

Here's a sample structure:

```bash
{
    "Person1": {
        "id": "12345",
        "priority": 1
    },
    "Person2": {
        "id": "67890",
        "priority": 2
    }
}
```

In this context, a higher priority number indicates a higher likelihood of being scheduled for services. In the example above, "Person2" is twice as likely to be scheduled as "Person1".

## Roadmap

Here are some of the enhancements and features I am planning on implementing and some I am considering:

- **Setlist Generator**: This feature would automatically generate a list of songs based on the scheduled players.
- **Items, Headers, Media**: Support fort items, headers, and media.
- **Other PCO Modules**: Expansion into giving, people, calendars, etc.

Please note that this roadmap is subject to change based on feedback, technical feasibility, and just my limited time in general. Please feel free to give any input as I would love to hear your ideas and suggestions!

## Support

If you encounter any problems or have any suggestions, feel free to [open an issue](https://github.com/joseph-hunter/PCO-Service-Builder/issues/new).

## License

This project is licensed under the terms of the MIT license. See [LICENSE](https://github.com/jahunter33/PCO-Service-Builder/blob/main/LICENSE) for more details.

Just make sure to replace `yourusername` with your actual GitHub username in the URLs. You should also verify that the information is accurate and modify it as necessary. For example, you might want to include more specific instructions for getting an Application ID and Secret from Planning Center, if they are not self-explanatory.
