let detallesBD = {
  nombreBD: "Datos",
  tablas: [
    {
      nombre: "Contactos",
      keyPath: "ID",
      autoInc: true,
      keyOpcional: [
        {
          nombre: "Buscar Nombre",
          keyPath: "Nombre",
          unique: false,
        },
        {
          nombre: "Buscar DNI",
          keyPath: "DNI",
          unique: true,
        },
      ],
    },
  ],
};

export { detallesBD };
