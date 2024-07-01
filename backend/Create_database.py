import sqlite3
import uuid
import sqlite3 as sql


class database:
    def create_file_table(self):
        conn = sqlite3.connect('database.db')
        cur = conn.cursor()
        conn.execute('''CREATE TABLE IF NOT EXISTS assistants (
                    uuid TEXT PRIMARY KEY,
                    assistant_id TEXT,
                    assistant_name TEXT,
                    trnscriber TEXT,
                    synthesizer TEXT,
                    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )''')
        conn.close()
   
    def insert_rows(self, assistant_id, assistant_name, transcriber,synthesizer):
        UUid = str(uuid.uuid4())
        with sql.connect("database.db") as con:
            cur = con.cursor()

            cur.execute('''INSERT INTO assistants (uuid, assistant_id, assistant_name, trnscriber, synthesizer) 
                VALUES (?, ?, ?, ?, ?)''',
                (UUid, assistant_id, assistant_name, transcriber, synthesizer) )
            con.commit()
            print("Record successfully added")
        con.close()

