import { INJECTION_TOKEN, REPOSITORY } from '../../../constant'
import { DataSource, Repository } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { User } from '../entity/user'

export const databaseProviders = [
    {
        provide: INJECTION_TOKEN.DATA_SOURCE,
        useFactory: async (): Promise<DataSource> => {
            try {
                const ormconfig: PostgresConnectionOptions = {
                    database: 'ticketing_db',
                    type: 'postgres',
                    username: 'nestjs',
                    password: 'nestjs',
                    host: 'localhost',
                    port: 5433,
                    logging: ['error', 'migration', 'schema', 'warn'],
                    synchronize: false,
                    migrationsRun: true,
                    entities: [__dirname + '/../entity/**/*.js'],
                    migrations: [__dirname + '/../migrations/**/*.js'],
                    subscribers: [],
                }

                const dataSource = new DataSource(ormconfig)
                const connection = await dataSource.initialize()

                console.log('Database connection has been established successfully.')

                return connection
            } catch (err) {
                console.error('Unable to connect to the database:', err)
                throw err
            }
        },
    },
    {
        provide: REPOSITORY.USER_REPOSITORY,
        useFactory: (dataSource: DataSource): Repository<User> => {
            return dataSource.getRepository(User)
        },
        inject: [INJECTION_TOKEN.DATA_SOURCE],
    },
]
