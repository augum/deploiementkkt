package bdom.kikwit.ServiceImplementation;

import bdom.kikwit.Dto.EtablissementRequestDto;
import bdom.kikwit.Dto.EtablissementResponseDto;
import bdom.kikwit.Entities.CartographieStructure;
import bdom.kikwit.Entities.Categorie;
import bdom.kikwit.Entities.Etablissement;
import bdom.kikwit.Mappers.EtablissementMapper;
import bdom.kikwit.Repositories.CategorieRepository;
import bdom.kikwit.Repositories.EtablissementRepository;
import bdom.kikwit.Services.EtablissementService;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service @AllArgsConstructor @Transactional
public class EtablissementServiceImpl implements EtablissementService {
    private EtablissementRepository repository;
    private CategorieRepository categorieRepository;
    private EtablissementMapper mapper;
    /*
    * Enregistrement d'un etablissement
    * */
    @Override
    public EtablissementResponseDto save(EtablissementRequestDto requestDto) {
        Etablissement etablissement = mapper.fromEtablissementRequestDto(requestDto);
        Etablissement save = repository.save(etablissement);
        return mapper.toEtablissementResponseDto(save);
    }
/*
* Modifier un etablissement
* */
    @Override
    public EtablissementResponseDto update(Long id, EtablissementRequestDto requestDto) {
        Etablissement getEtablissement = repository.findById(id).get();
        Etablissement etablissement = mapper.fromEtablissementRequestDto(requestDto);
        getEtablissement.setNom(etablissement.getNom());
        getEtablissement.setZone(etablissement.getZone());
        Etablissement save = repository.save(getEtablissement);
        return mapper.toEtablissementResponseDto(save);
    }
// recuperer un seul etablissement
    @Override
    public EtablissementResponseDto getOne(Long id) {
        Etablissement etablissement = repository.findById(id).get();
        return mapper.toEtablissementResponseDto(etablissement);
    }

    @Override
    public String delete(Long id) {
        Optional<Etablissement> etablissement = repository.findById(id);
        if (etablissement.isPresent()){
            repository.deleteById(id);
            return " Etablissement supprimée avec succes";
        }
        return "Aucun Etablissement trouvé";
    }

    // liste des etablissements
    @Override
    public List<EtablissementResponseDto> getAll() {
        List<Etablissement> list = repository.findAll();
        for(Etablissement ets : list){
            Categorie cat = categorieRepository.findById(ets.getId_cat()).get();
            ets.setCategorie(cat);
        }
        return list.stream()
                .map(etablissement -> mapper.toEtablissementResponseDto(etablissement))
                .collect(Collectors.toList());
    }
}
